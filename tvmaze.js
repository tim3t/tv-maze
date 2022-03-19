'use strict';

const $showsList = $('#shows-list');
const $episodesArea = $('#episodes-area');
const $episodesList = $('#episodes-list');
const $searchForm = $('#search-form');

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
	const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);

	return res.data.map((result) => {
		const show = result.show;
		return {
			id: show.id,
			name: show.name,
			summary: show.summary,
			image: show.image ? show.image.medium : 'https://tinyurl.com/tv-missing'
		};
	});
	console.log(show);
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
	$showsList.empty();

	for (let show of shows) {
		const $show = $(
			`<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name} class="card-img-top">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
		);

		$showsList.append($show);
	}
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
	const term = $('#search-query').val();
	const shows = await getShowsByTerm(term);

	$episodesArea.hide();
	populateShows(shows);
}

$searchForm.on('submit', async function(evt) {
	evt.preventDefault();
	await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
	const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
	return res.data.map((episode) => ({
		id: episode.id,
		name: episode.name,
		season: episode.season,
		number: episode.number
	}));
	console.log(episode);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
	$episodesList.empty();

	for (let episode of episodes) {
		const $episode = $(`<li>S${episode.season}, E${episode.number}: "${episode.name}"</li>`);

		$episodesList.append($episode);
	}
	$episodesArea.show();
}

async function getEpisodesAndDisplay(evt) {
	const showID = $(evt.target).closest('.Show').data('show-id');
	const episodes = await getEpisodesOfShow(showID);
	populateEpisodes(episodes);
}
$showsList.on('click', '.Show-getEpisodes', getEpisodesAndDisplay);
