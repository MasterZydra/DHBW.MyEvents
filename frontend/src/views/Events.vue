<template>
	<div>
		<p class="title white--text">Music events near you based on the genres of your favorite artists on Spotify.</p>
		<div class="chips">
			<v-chip
				class="ma-1"
				color="secondary"
				v-for="(genre, index) in genres"
				@click=""
			>
				{{genre}}
			</v-chip>
		</div>
		<v-alert v-if="error" type="error">
			{{error}}
		</v-alert>
		<div class="grid">
			<template v-for="(event, index) in events">
				<v-hover v-slot:default="{ hover }">
					<v-card class="event" tile :elevation="hover ? 16 : 2" @click="event.dialog = true">
						<div class="ma-3">
							<div class="headline font-weight-black">
								{{event.title}}
							</div>
							<div class="text-truncate">
								<v-icon>mdi-music-note-eighth</v-icon>
								<span>
									{{event.performers.join(', ')}}
								</span>
							</div>
							<div class="text-truncate">
								<v-icon>mdi-calendar</v-icon>
								<span>
									{{event.start_time}}
								</span>
							</div>
							<div class="text-truncate">
								<v-icon>mdi-map-marker</v-icon>
								<span>
									{{event.city_name}}, {{event.venue_name}}
								</span>
							</div>
						</div>
					</v-card>
				</v-hover>
				<v-dialog v-model="event.dialog" max-width="600px">
					<v-card>
						<v-card-title class="headline">{{event.title}}</v-card-title>
						<v-card-text>
							{{event.description}}
							<p></p>
							<div class="text-truncate">
								<v-icon>mdi-music-note-eighth</v-icon>
								<span>
									{{event.performers.join(', ')}}
								</span>
							</div>
							<div class="text-truncate">
								<v-icon>mdi-calendar</v-icon>
								<span>
									{{event.start_time}}
								</span>
							</div>
							<div class="text-truncate">
								<v-icon>mdi-map-marker</v-icon>
								<span>
									{{event.city_name}}, {{event.venue_name}} ({{event.venue_address}})
								</span>
							</div>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn text @click="event.dialog = false">
								Close
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</template>
		</div>
		<v-overlay :value="loading">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</div>
</template>

<script>
	import axios from "axios";
	import config from "../config";

	export default {
		name: "Events",
		data: () => ({
			loading: true,
			location: "Germany",
			error: false,
			events: [
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 1 Jahr wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart",
					dialog: false
				},
				{
					title: "AC/DC-Konzerte oder so", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 15 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart",
					dialog: false
				},
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhallelele",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 20 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart",
					dialog: false
				},
				{
					title: "AC/DC-Konzert", start_time:"20.10.2020 20:00", venue_name: "Schleierhalle",
					venue_address:"Kaiserstraße 115",
					description:"AC/DC kommt nach 55 Jahren wieder nach Deutschland. Die Vorband Volbeat heizt dabei so richt ein. Schnell Tickets sichern! ",
					performers: ["AC/DC", "Volbeat"],
					city_name: "Stuttgart",
					dialog: false
				}
			],
			genres: []
		}),
		async created() {
			let v = this;

			if (!localStorage.getItem('access_token')) {
				await v.getSpotifyAccessToken().then(function (access_token) {
					localStorage.setItem('access_token', access_token);
				});
			}
			let access_token = localStorage.getItem('access_token');

			v.getGenres(access_token).then(function (genres) {
				console.log(genres);
				v.genres = genres;
				return v.getEvents(genres);
			}).then(function (events) {
				console.log(events);
				v.loading = false;
			}).catch(function (error) {
				console.log(error);
				v.error = error;
			});
		},
		methods: {
			getSpotifyAccessToken: async function() {
				let data = {
					code: this.$route.query.code,
					redirect_uri: window.location.origin + window.location.pathname
				};
				console.log(data);
				return await axios.post(config.apiUrl + "getSpotifyAccessToken", data).then(function (response) {
					return Promise.resolve(response.data);
				}).catch(function (error) {
					return Promise.reject(error);
				});
			},
			getGenres: async function (access_token) {
				let data = { access_token };
				return await axios.post(config.apiUrl + "getGenres", data).then(function (response) {
					return Promise.resolve(response.data);
				}).catch(function (error) {
					return Promise.reject(error);
				});
			},
			getEvents: async function (genres) {
				let data = {
					genres,
					location: this.location,
					date: "Next week",
				};
				return await axios.post(config.apiUrl + "getEvents", data).then(function (response) {
					return Promise.resolve(response.data);
				}).catch(function (error) {
					return Promise.reject(error);
				});
			}
		}
	}
</script>

<style scoped>
	.event {
		height: 0;
		padding-bottom: 100%;
		position: relative;
	}
	.event:hover {
		cursor: pointer;
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