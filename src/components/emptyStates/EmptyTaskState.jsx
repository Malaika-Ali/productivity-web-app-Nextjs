"use client";

import { useEffect, useRef, useState } from "react";

export default function EmptyTasksState({
    onCreateTask,
    // targetSelector = "#add-task-trigger",
    targetSelector,
    element
}) {
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const arrowHeadRef = useRef(null);

    const [path, setPath] = useState(null);
    const [arrowHead, setArrowHead] = useState(null);
    const [viewport, setViewport] = useState({
        width: 0,
        height: 0,
    });

    // Calculate arrow position
    useEffect(() => {
        function calculateArrow() {
            const target = document.querySelector(targetSelector);
            const container = containerRef.current;

            if (!target || !container) {
                console.log(
                    "Arrow target not found:",
                    targetSelector
                );
                return;
            }

            const targetRect = target.getBoundingClientRect();
            const containerRect =
                container.getBoundingClientRect();

            const width = window.innerWidth;
            const height = window.innerHeight;

            setViewport({
                width,
                height,
            });

            // START POINT
            const textButton =
                container.querySelector("button");

            if (!textButton) return;

            const textRect =
                textButton.getBoundingClientRect();

            // Small gap between text and arrow
            const gap = 18;

            const startX =
                textRect.right + gap;

            // Center of the text vertically
            const startY =
                textRect.top +
                textRect.height / 2;

            // END POINT
            const endX =
                targetRect.left +
                targetRect.width / 2;

            const endY =
                targetRect.bottom + 12;

            const horizontalDistance =
                endX - startX;

            const verticalDistance =
                startY - endY;

            const control1X =
                startX +
                horizontalDistance * 0.42;

            const control1Y =
                startY;

            const control2X =
                endX -
                horizontalDistance * 0.12;

            const control2Y =
                endY +
                verticalDistance * 0.35;

            const pathData = `
                M ${startX} ${startY}
                C
                    ${control1X} ${control1Y},
                    ${control2X} ${control2Y},
                    ${endX} ${endY}
            `;

            // ARROW HEAD
            const angle = Math.atan2(
                endY - control2Y,
                endX - control2X
            );

            const arrowSize = 15;
            const arrowSpread = Math.PI / 5;

            const x1 =
                endX -
                arrowSize *
                Math.cos(
                    angle - arrowSpread
                );

            const y1 =
                endY -
                arrowSize *
                Math.sin(
                    angle - arrowSpread
                );

            const x2 =
                endX -
                arrowSize *
                Math.cos(
                    angle + arrowSpread
                );

            const y2 =
                endY -
                arrowSize *
                Math.sin(
                    angle + arrowSpread
                );

            const headData = `
                M ${x1} ${y1}
                L ${endX} ${endY}
                L ${x2} ${y2}
            `;

            setPath(pathData);
            setArrowHead(headData);
        }

        // Give the page time to finish rendering
        const timeout = setTimeout(
            calculateArrow,
            100
        );

        window.addEventListener(
            "resize",
            calculateArrow
        );

        window.addEventListener(
            "scroll",
            calculateArrow
        );

        return () => {
            clearTimeout(timeout);

            window.removeEventListener(
                "resize",
                calculateArrow
            );

            window.removeEventListener(
                "scroll",
                calculateArrow
            );
        };
    }, [targetSelector]);

    // Animate arrow drawing
    useEffect(() => {
        if (!path || !pathRef.current) return;

        const pathElement = pathRef.current;

        const length =
            pathElement.getTotalLength();

        // Reset animation
        pathElement.style.transition = "none";
        pathElement.style.strokeDasharray = length;
        pathElement.style.strokeDashoffset = length;

        if (arrowHeadRef.current) {
            arrowHeadRef.current.style.opacity = "0";
        }

        // Force browser to apply initial state
        pathElement.getBoundingClientRect();

        // Start drawing
        requestAnimationFrame(() => {
            pathElement.style.transition =
                "stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)";

            pathElement.style.strokeDashoffset = "0";

            // Show arrow head after line finishes
            setTimeout(() => {
                if (arrowHeadRef.current) {
                    arrowHeadRef.current.style.transition =
                        "opacity 250ms ease";

                    arrowHeadRef.current.style.opacity =
                        "1";
                }
            }, 1700);
        });
    }, [path]);

    return (
        <>
            {/* ----------------------------------------
                Empty state
            ----------------------------------------- */}

            <div
                ref={containerRef}
                className="
                    relative
                    w-full
                    min-h-[420px]
                    rounded-xl
                    flex
                    items-center
                    justify-center
                "
            >
                <button
                    className="
                        relative
                        z-10
                        text-purple-500
                        font-semibold
                        text-lg
                        hover:text-purple-600
                        transition-colors
                    "
                >
                    Create your first {element} now
                </button>
            </div>

            {/* ----------------------------------------
                Arrow overlay
            ----------------------------------------- */}

            {path && viewport.width > 0 && (
                <svg
                    width={viewport.width}
                    height={viewport.height}
                    viewBox={`0 0 ${viewport.width} ${viewport.height}`}
                    className="
                        fixed
                        top-0
                        left-0
                        pointer-events-none
                        z-[999]
                        overflow-visible
                    "
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Arrow line */}

                    <path
                        ref={pathRef}
                        d={path}
                        fill="none"
                        stroke="#ad46ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />

                    {/* Arrow head */}

                    <path
                        ref={arrowHeadRef}
                        d={arrowHead}
                        fill="none"
                        stroke="#ad46ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </>
    );
}