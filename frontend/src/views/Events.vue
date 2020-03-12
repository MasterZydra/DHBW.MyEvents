<template>
	<div>
		<p class="title white--text">Music events near you based on the genres of your favorite artists on Spotify.</p>
		<h2 class="white--text">Filter:</h2>
		<v-card class="pa-4" tile>
			<v-form v-model="valid" ref="form">
				<v-text-field :rules="rules" label="Location" outlined v-model="location" clearable required></v-text-field>
				<v-select :items="date" label="Date range" outlined v-model="selectedDate">
				</v-select>
				<template v-if="genres.length > 0">
					<span class="font-italic grey--text subtitle-2">Click to disable/enable genres:</span>
					<v-btn text icon @click="genres.forEach(g => disableGenre(g))">
						<v-icon>mdi-checkbox-multiple-blank-circle</v-icon>
					</v-btn>
					<v-btn text icon @click="genres.forEach(g => enableGenre(g))">
						<v-icon color="secondary">mdi-checkbox-multiple-blank-circle</v-icon>
					</v-btn>
					<div class="chips">
						<v-chip
								class="ma-1" color="secondary"
								v-for="(genre, index) in genres" :key="genre.name"
								:color="genre.color"
								@click="genre.disabled ? enableGenre(genre) : disableGenre(genre)">
							{{genre.name}}
						</v-chip>
					</div>
				</template>
				<v-btn :disabled="!valid || !genresValid" @click="updateEvents" color="primary">Anwenden</v-btn>
			</v-form>
		</v-card>
		<br>
		<br>

		<h1 class="white--text">Events:</h1>

		<v-alert v-if="error" type="error">
			{{error}}
		</v-alert>
		<v-alert v-if="eventsRequested && events.length <= 0" colored-border border="left" color="warning" tile>
			No Events found.<br>
			Please change your filter above or your music taste.
		</v-alert>
		<div class="d-flex justify-center" v-if="loadingEvents">
			<span class="white--text">loading events...</span>
			<v-progress-circular indeterminate size="16" color="white" class="ma-1"></v-progress-circular>
		</div>
		<div class="grid">
			<template v-for="(event, index) in events">
				<v-hover v-slot:default="{ hover }">
					<v-card class="event" tile :elevation="hover ? 16 : 2" @click="event.dialog = true">
						<div class="ma-3">
							<div class="headline font-weight-black">
								{{event.title}}
							</div>
							<div class="text-truncate" v-if="event.performers.length > 0">
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
							<p v-if="event.description" v-html="event.description"></p>
							<p v-else>
								No descripion...
							</p>
							<p></p>
							<div v-if="event.performers.length > 0">
								<v-icon>mdi-music-note-eighth</v-icon>
								<span>
									{{event.performers.join(', ')}}
								</span>
							</div>
							<div>
								<v-icon>mdi-calendar</v-icon>
								<span>
									{{event.start_time}}
								</span>
							</div>
							<div>
								<v-icon>mdi-map-marker</v-icon>
								<span>
									{{event.city_name}}, {{event.venue_name}}
								</span>
								<span v-if="event.venue_address">
									({{event.venue_address}})
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
		<v-overlay :value="loadingGlobal">
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
			valid: true,
			genresValid: true,
			rules: [v => !!v || 'Name is required'],
			loadingGlobal: true,
			loadingEvents: false,
			eventsRequested: false,
			location: "Germany",
			error: false,
			selectedDate: "Next Week",
			date: [
				"All", "Future", "Past", "Today", "Last Week", "This Week", "Next Week",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
				"November", "December",
			],
			events: [],
			genres: []
		}),
		async created() {
			let v = this;

			// initially save access_token
			if (!localStorage.getItem('access_token')) {
				await this.getSpotifyAccessToken().then(function (tokens) {
					localStorage.setItem('access_token', tokens.access_token);
					localStorage.setItem('refresh_token', tokens.refresh_token);
				}).catch(function (error) {
					v.error = error.response.data;
				});
			}

			this.updateEvents();
		},
		methods: {
			async updateEvents() {
				let v = this;
				v.getGenres().then(function (genres) {
					v.loadingEvents = true;
					v.getEvents(genres).then(function (events) {
						console.log(events);
						v.writeEvents(events);
					}).catch(function (error) {
						v.error = error.response.data;
					}).finally(function () {
						v.eventsRequested = true;
						v.loadingEvents = false;
					});
				}).catch(function (error) {
					if (error.response.status === 401) {
						v.refreshSpotifyToken().then(function () {
							v.updateEvents();
						});
					} else {
						v.error = error.response.data;
					}
				}).finally(function () {
					v.loadingGlobal = false;
				});
			},

			writeGenres(genres) {
				genres = genres[0] ? genres : [];
				this.genres = genres.map(function (genre) {
					return {
						name: genre,
						disabled: false,
						color: "secondary"
					}
				});
			},

			writeEvents(events) {
				let newEvents = events[0] ? events : [];
				newEvents.forEach(function (event) {
					event.dialog = false;
				});
				this.events = newEvents;
			},

			getSpotifyAccessToken: async function() {
				let data = {
					code: this.$route.query.code,
					redirect_uri: window.location.origin + window.location.pathname
				};
				return await axios.post(config.apiUrl + "getSpotifyAccessToken", data).then(function (response) {
					return Promise.resolve(response.data);
				}).catch(function (error) {
					return Promise.reject(error);
				});
			},
			refreshSpotifyToken: async function() {
				let v = this;
				let data = { refresh_token: localStorage.getItem("refresh_token") };
				return await axios.post(config.apiUrl + "getSpotifyAccessToken/refresh", data).then(function (response) {
					localStorage.setItem("access_token", response.data);
					return Promise.resolve(response.data);
				}).catch(function (error) {
					v.error = "Could not refresh Spotify access_token: " + error.response.data + ". Please login again with Spotify.";
					return Promise.reject(error);
				});
			},

			getGenres: async function() {
				let v = this;
				let enabledGenres = this.getEnabledGenres();
				if (enabledGenres.length > 0) {
					return v.getEnabledGenres().map(g => g.name);
				} else {
					let access_token = localStorage.getItem('access_token');
					return await v.getSpotifyGenres(access_token).then(function (genres) {
						v.writeGenres(genres);
						return Promise.resolve(genres);
					}).catch(function (error) {
						return Promise.reject(error);
					});
				}
			},
			getSpotifyGenres: async function (access_token) {
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
					date: this.selectedDate,
				};
				console.log(data);
				return await axios.post(config.apiUrl + "getEvents", data).then(function (response) {
					return Promise.resolve(response.data);
				}).catch(function (error) {
					return Promise.reject(error);
				});
			},

			getEnabledGenres() {
				return this.genres.filter(g => !g.disabled);
			},
			enableGenre(genre) {
				genre.color = 'secondary';
				genre.disabled = false;
				this.genresValid = true;
			},
			disableGenre(genre) {
				genre.color = 'grey';
				genre.disabled = true;
				if (this.getEnabledGenres().length <= 0) {
					this.genresValid = false;
				}
			},


			validate () {
				this.$refs.form.validate()
			},
		}
	}
</script>

<style scoped>
	.event {
		height: 0;
		padding-bottom: 75%;
		position: relative;
	}
	.event .headline {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.event:hover {
		cursor: pointer;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(272px, 1fr));
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
</style>