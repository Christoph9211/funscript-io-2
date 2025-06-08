import { useEffect, useState } from "react";
import { useKeon } from "lib/hooks/useKeon";
import { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import AudioPlayer from "./AudioPlayer";
import ScriptPlayer from "./ScriptPlayer";
import VideoPlayer from "./VideoPlayer";

const Player = ({
    content,
    funscript,
    countdownTime = 0,
}: {
    content: PlayableContent | null;
    funscript: Funscript | null;
    countdownTime?: number;
}): JSX.Element => {
    const { device, linear, stop } = useKeon();

    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [scriptDuration, setScriptDuration] = useState(0);
    const [ended, setEnded] = useState(false);

    const getFunscriptPadding = () => {
        if (!funscript) return "0px";
        if (duration === 0) return "0px";
        const lastAction = funscript.actions.slice(-1)[0].at / 1000;
        const videoFraction = lastAction / duration;
        const videoPercentage = 100 - Math.min(100, 100 * videoFraction);
        return `${videoPercentage}%`;
    };

    useEffect(() => {
        if (!funscript) setScriptDuration(0);
        else setScriptDuration(funscript.actions.slice(-1)[0].at / 1000);
    }, [funscript]);


    useEffect(() => {
        if (!device || !playing || !funscript) return;
        const timeMs = progress * duration * 1000;
        const actions = funscript.actions;
        if (!actions.length) return;
        let index = 0;
        while (index + 1 < actions.length && timeMs >= actions[index + 1].at) {
            index++;
        }
        const pos = actions[index].pos / 100;
        const nextAt = index + 1 < actions.length ? actions[index + 1].at : actions[index].at + 100;
        const dur = Math.max(0, nextAt - timeMs);
        linear(pos, dur);
    }, [device, playing, progress, duration, funscript, linear]);

    useEffect(() => {
        if (!playing) stop();
    }, [playing, stop]);

    return (
        <div>
            {content && content.type === "video" && (
                <VideoPlayer
                    content={content}
                    playing={playing}
                    countdownTime={countdownTime}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onProgress={setProgress}
                    onDuration={setDuration}
                    onSeekEnd={() => {
                        // Nothing to do here since device position is derived
                        // from progress/duration state.
                    }}
                />
            )}
            {content && content.type === "audio" && (
                <AudioPlayer
                    content={content}
                    playing={playing}
                    countdownTime={countdownTime}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onProgress={setProgress}
                    onDuration={setDuration}
                    onSeekEnd={() => {
                        // Nothing to do here since device position is derived
                        // from progress/duration state.
                    }}
                />
            )}
            {!content && funscript && (
                <ScriptPlayer
                    script={funscript}
                    playing={playing}
                    countdownTime={countdownTime}
                    time={progress * duration}
                    ended={ended}
                    onPlay={() => {
                        if (ended) {
                            setProgress(0);
                            setEnded(false);
                        }
                        setPlaying(true);
                    }}
                    onPause={() => setPlaying(false)}
                    onProgress={setProgress}
                    onDuration={setDuration}
                    onSeek={time => {
                        setProgress(time / duration);
                    }}
                    onSeekEnd={() => {
                        // Nothing to do here since device position is derived
                        // from progress/duration state.
                    }}
                    onEnded={() => {
                        setPlaying(false);
                        setEnded(true);
                    }}
                />
            )}
            {funscript && (
                <div className="relative px-2 bg-black bg-opacity-40 rounded-bl rounded-br">
                    <div
                        style={{
                            paddingRight: getFunscriptPadding(),
                        }}
                    >
                        <FunscriptHeatmap funscript={funscript} className="h-12" />
                    </div>
                    <div className="absolute w-full left-0 top-0 h-12">
                        <div className="relative w-full px-2 h-full">
                            <div
                                className="relative bottom-0 bg-white h-full"
                                style={{
                                    left: `${progress * 100}%`,
                                    width: "1px",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Player;
