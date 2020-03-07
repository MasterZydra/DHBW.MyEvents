<template>
	<div>
		<p class="title white--text">Music events near you based on the genres of your favorite artists on Spotify.</p>
		<div class="chips">
			<v-chip
				class="ma-1"
				color="secondary"
				v-for="(genre, index) in genres" :key="genre.name"
			>
				{{genre.name}}
			</v-chip>
		</div>
		<div class="grid">
			<template v-for="(event, index) in events">
				<v-card class="event" tile>
					<div class="ma-3">
						<div class="headline font-weight-black">
							{{event.title}}
						</div>
						<div class="bottom-left">
							<v-icon>mdi-map-marker</v-icon>
							{{event.city_name}}, {{event.venue_name}}
						</div>
					</div>
				</v-card>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Events",
		data: () => ({
			events: [
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 10 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart"
				},
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 10 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart"
				},
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 10 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart"
				},
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 10 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart"
				}
			],
			genres: [
				{name: "rap"},
				{name: "hip hop"},
				{name: "schlager"},
				{name: "hard rock"},
				{name: "post-grunge"},
			]
		}),
	}
</script>

<style scoped>
	.event {
		height: 0;
		padding-bottom: 100%;
		position: relative;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		grid-gap: 2rem;
	}
	.chips {
		margin-bottom: 1rem;
	}
	.bottom-left {
		position: absolute;
		bottom: 0;
		margin-bottom: 1rem;
	}
	.event-wrapper {
		/*position: relative;*/
	}
</style>