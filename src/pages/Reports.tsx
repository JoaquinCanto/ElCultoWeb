import { Divider, Progress } from "@heroui/react";
import { useRelevantSuggestions, useTopGames } from "../services/queries";
import { TopSuggestionsGet } from "../types/suggestion";
import { TopGameGet } from "../types/game";


const Reports = () => {
	const relevantSuggestionsQuery = useRelevantSuggestions();
	const topPlayedQuery = useTopGames();


	const barGraphTopSuggested = () => {
		return relevantSuggestionsQuery.data?.items.map((suggestionData: TopSuggestionsGet) => (
			<div key={suggestionData.juego} className="flex flex-col gap-6 w-full max-w-md">
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
			<div key={playedData.nombre} className="flex flex-col gap-6 w-full max-w-md">
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
		<div className="flex flex-col gap-4 p-4">
			<p>Reports</p>
			<Divider />
			<p>Top 10 Juegos más sugeridos:</p>
			{barGraphTopSuggested()}
			<Divider />
			<p>Top 10 Juegos más jugados:</p>
			{barGraphTopPlayed()}
		</div>
	)
}

export default Reports