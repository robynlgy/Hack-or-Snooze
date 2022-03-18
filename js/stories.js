"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  console.log("storylist is", storyList);
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`<li id="${story.storyId}">
  <button class="iconButton"><i class="fa-regular fa-star"></i></button> <a href="${story.url}"
   target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** Collects submit form input and adds story to page when user submits.*/

async function formSubmitAddStory() {
  const formInputs = {
    "author": $submitAuthor.val(),
    "title": $submitTitle.val(),
    "url": $submitURL.val()
  };

  const addedStory = await storyList.addStory(currentUser, formInputs);
  //storyList = await StoryList.getStories();
  console.log("addedStory...", addedStory);
};

/** When form is submitted, add story to API and update UI to show new story. */
$submitForm.on("submit", async (e) => {
  await formSubmitAddStory();
  getAndShowStoriesOnStart();
});

/** When favorite star is clicked, add "favorited" class to star icon.*/
$storiesContainer.on("click", ".iconButton", (evt) => {
  evt.preventDefault();
  console.log(evt.target, "evt target ");
  if (evt.target.tagName !== "BUTTON") {
    const targetStoryId = Story.getStoryId(evt.target);
    const story = storyList.stories.filter(story => story.storyId === targetStoryId);
    if (!evt.target.classList.contains("favorited")) {
      $(evt.target).toggleClass("favorited");
      currentUser.addFavorite(story[0]);
    } else {
      $(evt.target).toggleClass("favorited");
      currentUser.removeFavorite(story[0]);
    }
  }
}
);


