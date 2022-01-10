import React, {
	useState,
	useEffect,
	useCallback,
	ReactNode,
	useRef,
} from "react";
// import { PrevButton, NextButton } from "./EmblaCarouselButtons";
import useEmblaCarousel from "embla-carousel-react";

const CarouselComponent = ({
	slidesLength,
	slides,
}: {
	slidesLength: number;
	slides: ReactNode[];
}) => {
	const [viewportRef, embla] = useEmblaCarousel({
		loop: false,
	});
	const countRef = useRef(0);
	const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
	const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
	const slideHeightsRef = useRef([]);
	const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
	const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

	const onSelect = useCallback(() => {
		if (!embla) return;
		setPrevBtnEnabled(embla.canScrollPrev());
		setNextBtnEnabled(embla.canScrollNext());
		storeSlideHeights();
		setContainerHeight();
	}, [embla]);

	const readSlideHeights = useCallback(
		() =>
			embla.slideNodes().map((slideNode) => {
				const slideInner = slideNode.querySelector("*");
				return slideInner?.getBoundingClientRect()?.height;
			}),
		[embla]
	);

	const adaptContainerToSlide = useCallback(() => {
		const currentSlideHeight =
			slideHeightsRef.current[embla.selectedScrollSnap()];
		embla.containerNode().style.height = `${currentSlideHeight}px`;
	}, [slideHeightsRef, embla]);

	const storeSlideHeights = useCallback(() => {
		const currentHeights = readSlideHeights();
		slideHeightsRef.current = currentHeights;
	}, [readSlideHeights]);

	const setContainerHeight = useCallback(() => {
		adaptContainerToSlide();
	}, [adaptContainerToSlide]);

	useEffect(() => {
		if (embla && embla.slideNodes().length !== slides.length) {
			embla.reInit(); // If the slides prop length changes, pick it up
		}
	}, [embla, slides]);

	useEffect(() => {
		if (!embla) return;

		console.log(
			"RENDERING",
			embla.slideNodes().length === 0,

			embla.slideNodes()
		);
		embla
			.on("init", () => {
				storeSlideHeights();
				setContainerHeight();
			})
			.on("resize", () => {
				console.log("RESIZING", slideHeightsRef.current);
				storeSlideHeights();
			})
			.on("resize", setContainerHeight)
			.on("select", onSelect);
		storeSlideHeights();
		setContainerHeight();
		onSelect();

		return () => {
			embla
				.off("init", storeSlideHeights)
				.off("init", setContainerHeight)
				.off("resize", storeSlideHeights)
				.off("resize", setContainerHeight)
				.off("select", onSelect);
		};
	}, [embla, onSelect, storeSlideHeights, setContainerHeight]);

	return (
		<>
			<div className="embla relative">
				<div className="embla__viewport" ref={viewportRef}>
					<div className="embla__container ">
						{slides.map((child, index) => (
							<div className="embla__slide transition-all" key={index}>
								{child}
							</div>
						))}
					</div>
				</div>
				{/* <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} /> */}
			</div>
		</>
	);
};

export default CarouselComponent;
