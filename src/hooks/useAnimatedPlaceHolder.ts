import { useEffect, useState } from "react";

const useAnimatedPlaceHolder = (phrases: string[]) => {
    const pauseDuration = 1500;
    const [placeholder, setPlaceholder] = useState<string>('');
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        let current = phrases[index];
        let timeout: NodeJS.Timeout;
        if (!isDeleted && placeholder == current) {
            timeout = setTimeout(() => {
                setIsDeleted(true);
            }, pauseDuration);
        } else if (isDeleted && placeholder == '') {
            setIndex((prev) => (prev + 1) % phrases.length);
            current = phrases[index];
            setIsDeleted(false);
        } else {
            const speed = isDeleted ? 80 : 130;
            timeout = setTimeout(() => {
                setPlaceholder(
                    isDeleted
                        ? current.substring(0, placeholder.length - 1)
                        : current.substring(0, placeholder.length + 1)
                );
            }, speed)
        }

        return () => clearTimeout(timeout);
    }, [placeholder, isDeleted, index]);

    return placeholder;
}

export default useAnimatedPlaceHolder;