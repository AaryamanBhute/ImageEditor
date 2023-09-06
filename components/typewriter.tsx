"use client";

import React, { useState, useEffect } from 'react';

type TypewriterProps = {
    text: string,
    delay: number,
};

export default function Typewriter(props: TypewriterProps){
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < props.text.length) {
            const timeout = setTimeout(() => {
            setCurrentText(prevText => prevText + props.text[currentIndex]);
            setCurrentIndex(prevIndex => prevIndex + 1);
            }, props.text[currentIndex] !== ',' ? props.delay : props.delay * 4);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, props.delay, props.text]);

    return <span className='typewriter'>{currentText}</span>;
};