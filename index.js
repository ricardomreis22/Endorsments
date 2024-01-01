import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-d6bc1-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const commentInDB = ref(database, "comments");
const publishButtonEl = document.getElementById("publish-button");

const inputCommentEl = document.getElementById("input-comment");
const inputFromEl = document.getElementById("input-from");
const inputToEl = document.getElementById("input-to");

const commentContainerEl = document.getElementById("comment-container");

// clear comments before when we get them from the datable
function clearComments() {
  commentContainerEl.innerHTML = "";
}

// push the comment obj to the db
publishButtonEl.addEventListener("click", function () {
  let publication = {
    comment: inputCommentEl.value,
    from: inputFromEl.value,
    to: inputToEl.value,
    likes: 0,
  };

  push(commentInDB, publication);
});

function insertComment(id, comment, from, to, likes) {
  let newDiv = document.createElement("div");
  let pComment = document.createElement("p");
  let pFrom = document.createElement("p");
  let pTo = document.createElement("p");
  let pLikes = document.createElement("p");
  let lastDiv = document.createElement("div");
  let likesDiv = document.createElement("div");
  let icon = document.createElement("i");

  icon.addEventListener("click", function () {
    updateComment(id, comment, from, to, likes);
  });

  pComment.textContent = comment;
  pFrom.textContent = `From ${from}`;
  pTo.textContent = `To ${to}`;
  pLikes.textContent = likes;

  newDiv.className = "full-comment";
  pComment.className = "comment";
  pTo.className = "to";
  likesDiv.className = "likes-div";
  lastDiv.className = "last-div";
  pFrom.className = "from";
  pLikes.className = "likes";

  icon.className = "fa-solid fa-heart icon";

  newDiv.appendChild(pTo);
  newDiv.appendChild(pComment);
  lastDiv.appendChild(pFrom);
  likesDiv.appendChild(pLikes);
  likesDiv.appendChild(icon);
  lastDiv.appendChild(likesDiv);
  newDiv.appendChild(lastDiv);

  commentContainerEl.append(newDiv);
}

onValue(commentInDB, function (snapshot) {
  clearComments();
  let commentsArr = Object.entries(snapshot.val());

  for (let i = commentsArr.length - 1; i >= 0; i--) {
    let currentitem = commentsArr[i];
    let currentItemId = currentitem[0];
    let currentItemValue = currentitem[1];

    let stringifiedCommentsArr = JSON.stringify(commentsArr);
    localStorage.setItem("likes", stringifiedCommentsArr);

    insertComment(
      currentItemId,
      currentItemValue.comment,
      currentItemValue.from,
      currentItemValue.to,
      currentItemValue.likes
    );
  }
  inputCommentEl.value = "";
  inputFromEl.value = "";
  inputToEl.value = "";
});

function updateComment(id, comment, from, to, likes) {
  if (likes === 0) {
    update(ref(database, "comments/" + id), {
      comment: comment,
      from: from,
      to: to,
      likes: likes + 1,
    });
  } else {
    update(ref(database, "comments/" + id), {
      comment: comment,
      from: from,
      to: to,
      likes: likes - 1,
    });
  }
}
