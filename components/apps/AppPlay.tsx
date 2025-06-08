import React, { useMemo, useState } from "react";
import ContentDropzone, { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";
import TextField from "components/molecules/TextField";
import Player from "./play/Player";

const AppPlay = (): JSX.Element => {
    const [content, setContent] = useState<PlayableContent | null>(null);
    const [funscript, setFunscript] = useState<Funscript | null>(null);
    const [countdownTime, setCountdownTime] = useState("");
    const countdownSeconds = useMemo(() => {
        if (!countdownTime) return 0;
        const pieces = countdownTime.split(":");
        if (pieces.length > 2) return 0;
        let seconds = 0;
        for (let i = 0; i < pieces.length; i++) {
            if (!pieces[i]) continue;
            if (pieces.length > 1 && i === 0) seconds += 60 * Number(pieces[i]);
            else if (pieces.length === 1 || i > 0) seconds += Number(pieces[i]);
        }
        return seconds;
    }, [countdownTime]);
    const prepare = (_filename: string, script: Funscript) => {
        if (!script) return;
        setFunscript(script);
    };

    const isCountdownTimeValid = (time: string) => {
        if (!time) return true;
        const pieces = time.split(":");
        if (pieces.length > 2) return false;
        for (let i = 0; i < pieces.length; i++) {
            if (!pieces[i]) continue;
            if (isNaN(Number(pieces[i]))) return false;
        }
        return true;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4">
                <ContentDropzone value={content} onChange={setContent} className="h-16 md:h-32" />
                <FunscriptDropzone value={funscript} onChange={prepare} className="h-16 md:h-32" />
            </div>
            <Player
                content={content}
                funscript={funscript}
                countdownTime={countdownSeconds}
            />
            {content && (
                <TextField
                    label="Countdown Time"
                    className="mt-2"
                    value={countdownTime}
                    error={isCountdownTimeValid(countdownTime) ? "" : "Invalid time"}
                    onChange={setCountdownTime}
                />
            )}
        </div>
    );
};

export default AppPlay;
