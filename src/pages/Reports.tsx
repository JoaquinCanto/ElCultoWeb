import { Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react";
import { useRelevantSuggestions, useTopGames } from "../services/queries";
import { TopSuggestionsGet } from "../types/suggestion";
import { TopGameGet } from "../types/game";


const Reports = () => {
	const relevantSuggestionsQuery = useRelevantSuggestions();
	const topPlayedQuery = useTopGames();


	const barGraphTopSuggested = () => {
		return relevantSuggestionsQuery.data?.items.map((suggestionData: TopSuggestionsGet) => (
			<div key={suggestionData.juego}
				className="flex flex-col gap-6 w-full sm:max-w-80"
			>
				<Progress
					label={suggestionData.juego}
					value={suggestionData.cantidad}
					formatOptions={{ style: "decimal" }}
					minValue={0}
					maxValue={15}
					showValueLabel={true}
				/>
			</div>
		))
	}

	const barGraphTopPlayed = () => {
		return topPlayedQuery.data?.items.map((playedData: TopGameGet) => (
			<div key={playedData.nombre}
				className="flex flex-col gap-6 w-full sm:max-w-80"
			>
				<Progress
					label={playedData.nombre}
					value={playedData.cantidadInscripciones}
					formatOptions={{ style: "decimal" }}
					minValue={0}
					maxValue={15}
					showValueLabel={true}
				/>
			</div>
		))
	}

	return (
		<div className="h-full flex flex-wrap justify-items-center p-4 gap-4">
			<p className='font-bold text-2xl'
			>Reportes</p>
			<Divider />
			<Card className='w-full sm:max-w-80'>
				<CardHeader className='font-bold'>
					<p>Top 10 Juegos más sugeridos:</p>
				</CardHeader>
				<Divider />
				<CardBody>
					{barGraphTopSuggested()}
				</CardBody>
			</Card>
			{/* <Divider /> */}
			<Card className='w-full sm:max-w-80'>
				<CardHeader className='font-bold'>
					<p>Top 10 Juegos más jugados:</p>
				</CardHeader>
				<Divider />
				<CardBody>
					{barGraphTopPlayed()}
				</CardBody>
			</Card>
		</div>
	)
}

export default Reports