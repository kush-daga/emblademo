import CarouselComponent from "../components/CarouselComponent";

export default function Home() {
	return (
		<div className="bg-red-100 flex flex-col space-y-10 min-h-screen">
			{[0, 1, 2, 3, 4, 5].map((e) => {
				return (
					<CarouselComponent
						slides={[
							<div className="bg-green-100 w-full max-h-64" key={1}>
								<img
									alt="sds"
									src={`https://source.unsplash.com/random?${e}`}
									className="object-contain w-full max-h-64"
								/>
							</div>,
						]}
						slidesLength={1}
						key={e}
					/>
				);
			})}
		</div>
	);
}
