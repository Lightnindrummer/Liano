const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

//on scroll for non-mobile screens bring down nav based on scroll height
window.onscroll = function () {
  var currentScrollPos = window.scrollY;

  if (currentScrollPos < 50 || vw < 625) {
    document.getElementsByClassName("nav")[0].style.top = "-100px";
  } else {
    document.getElementsByClassName("nav")[0].style.top = "0";
  }
};
[...document.getElementsByClassName("mobile-nav-screen")[0].children].forEach((element) => {
  element.addEventListener("click", function () {
    document.getElementsByClassName("mobile-nav")[0].children[0].checked = false;
  });
});

//Canvas draws heyo
var ctx = document.querySelector("canvas").getContext("2d");
var dashLen;
var dashOffset;
var speed;
var txt;
var x;
var y;
var i;
var fontSize;
function setCanvasUp() {
  (dashLen = 350),
    (dashOffset = dashLen),
    (speed = 7),
    (txt = "HEYO"),
    (x = 5), //document.querySelector("canvas").width / 2 - ctx.measureText(txt).width / 2),
    (y = 0.55 * document.querySelector("canvas").clientWidth), //0.5 * document.querySelector("canvas").clientWidth ),
    (i = 0);
  document.querySelector("canvas").style.height =
    0.6 * document.querySelector("canvas").clientWidth + "px";
  document.querySelector("canvas").width = document.querySelector("canvas").clientWidth;
  document.querySelector("canvas").height = document.querySelector("canvas").clientHeight;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.globalAlpha = 1;
  fontSize = 45;
  ctx.font = "700 " + fontSize + "px Kalam, cursive";
  do {
    fontSize--;
    ctx.font = "700 " + fontSize + "px Kalam, cursive";
  } while (ctx.measureText(txt).width + 25 > document.querySelector("canvas").clientWidth);
  ctx.font = "700 " + fontSize + "px Kalam, cursive";
  ctx.strokeStyle = ctx.fillStyle = "#f2f2f2";
  ctx.lineCap = "round";
  ctx.textAlign = "left";
}

function loop() {
  if (txt[i] !== undefined) {
    ctx.clearRect(x, 0, 60, y);
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    dashOffset -= speed; // reduce dash length
    ctx.strokeText(txt[i], x, y); // stroke letter
    if (dashOffset > 0) requestAnimationFrame(loop); // animate
    else {
      ctx.fillText(txt[i], x, y);
      dashOffset = dashLen; // prep next char
      x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random() + 5;
      ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
      ctx.rotate(Math.random() * 0.005); // random rotation
      if (i < txt.length) requestAnimationFrame(loop);
    }
  }
}

//Events on scroll based on intersection API stuff

let options = {
  // root: document.getElementById("about-me").children[1].children[1] ,
  rootMargin: "0px",
  threshold: 0.6,
};
var musicHeading = Array(...document.getElementsByClassName("music"))[0].children[0].children[0];
let callBack = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      switch (entry.target) {
        case document.getElementById("home"):
          Array(...document.getElementsByClassName("homeLink")).forEach((link) => {
            link.setAttribute("scrolledOn", true);
          });
          break;
        case document.getElementById("about-me"):
          Array(...document.getElementsByClassName("aboutMeLink")).forEach((link) => {
            link.setAttribute("scrolledOn", true);
          }); 
          document.getElementById("header_aboutMe").setAttribute("scrolledOn", true);
        case document.getElementById("heyo"):
          setCanvasUp();
          loop(); 
          break;
        case document.getElementById("music"):
          Array(...document.getElementsByClassName("musicLink")).forEach((link) => {
            link.setAttribute("scrolledOn", true);
          }); 
        case musicHeading: 
          musicHeading.setAttribute("scrolledOn", true);
          setTimeout(function () {
            musicHeading.style.color = "rgb(22, 31, 45)";
            musicHeading.style.textShadow = "none";
          }, 750);

          break;
      }
    } else {
      switch (entry.target) {
        case document.getElementById("home"):
          Array(...document.getElementsByClassName("homeLink")).forEach((link) => {
            link.setAttribute("scrolledOn", false);
          });
          break;
        case document.getElementById("about-me"):
          Array(...document.getElementsByClassName("aboutMeLink")).forEach((link) => {
            link.setAttribute("scrolledOn", false);
          });
          document.getElementById("header_aboutMe").setAttribute("scrolledOn", false);
        case document.getElementById("heyo"):
          if (ctx != undefined || ctx != null) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          } 
          break;
        case document.getElementById("music"):
          Array(...document.getElementsByClassName("musicLink")).forEach((link) => {
            link.setAttribute("scrolledOn", false);
          }); 
        case musicHeading: 
          musicHeading.setAttribute("scrolledOn", false);
          musicHeading.style.animation = "";
          musicHeading.style.color = "#f4f4f4";
          musicHeading.style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
          break;
      }
    }
  });
};

let observer = new IntersectionObserver(callBack, options);
observer.observe(document.getElementById("heyo"));
observer.observe(musicHeading);
observer.observe(document.getElementById("home"));
observer.observe(document.getElementById("music"));
observer.observe(document.getElementById("about-me"));
//if screen size changes
window.onresize = function () {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  setTimeout(function () {
    setCanvasUp();
    setTimeout(requestAnimationFrame(loop), 1000);
  }, 1000);
};

//Handle numbered inputs

function imposeMinMax(el) {
  if (el.value != "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
    }
  }
}
//Youtube API Stuff
//var lianoChannelID = "UCqI8paXTIWivf5Fs3j_Uhxg"
var filters = document.getElementById("container_filterOptions");
var inputQueries = document.getElementById("queriesInput");
let totalVideos;
let maxResults = "";
let musicList;
//Most Recent Videos  https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCqI8paXTIWivf5Fs3j_Uhxg&maxResults=5&order=date&key=AIzaSyD0qU8w-eyrp9yhvVDlqPKS4EFNoOtJDas

filters.children[0].setAttribute("status", "selected");
filters.children[1].setAttribute("status", "not-selected");

Array(...filters.children).forEach((span) => {
  span.addEventListener("click", function () {
    if (Array(...filters.children).indexOf(span) == 1) {
      filters.children[1].setAttribute("status", "selected");
      filters.children[0].setAttribute("status", "not-selected");
    } else if (Array(...filters.children).indexOf(span) == 0) {
      filters.children[1].setAttribute("status", "not-selected");
      filters.children[0].setAttribute("status", "selected");
    }
    displayVids(musicList);
  });
});

inputQueries.addEventListener("change", function () {
  displayVids(musicList);
});

inputQueries.oninput = () => {
  imposeMinMax(inputQueries);
};
getYoutubeVideos();

async function getYoutubeVideos() {
  try {
    const youtubeAPIKEY = "AIzaSyD0qU8w-eyrp9yhvVDlqPKS4EFNoOtJDas";
    const data = await getYoutubeAPI(youtubeAPIKEY);
    totalVideos = data.pageInfo.totalResults;
    maxResults = "&maxResults=" + totalVideos;
    musicList = data.items;
    checkAllVideos(youtubeAPIKEY);
  } catch (error) {
    console.error("Error: ", error);
  }
}
//chekc if some videos are not present
async function checkAllVideos(youtubeAPIKEY) {
  if (musicList.length !== totalVideos) {
    await getYoutubeVideos();
  } else {
    var allVideoID = "";
    for (var i in musicList) {
      allVideoID += "&id=" + musicList[i].snippet.resourceId.videoId;
    }
    try {
      const response = await fetch(
        "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics" +
          allVideoID +
          "&key=" +
          youtubeAPIKEY +
          maxResults
      );
      const data = await response.json();
      musicList = data.items;
      inputQueries.max = musicList.length;
      displayVids(musicList);
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}

//make universal API call function
async function getYoutubeAPI(youtubeAPIKEY) {
  try {
    var playListID = "PLgcOOHWxAGNBACwDmwtyYX9ViVtlFucgG";
    const response = await fetch(
      "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" +
        playListID +
        "&key=" +
        youtubeAPIKEY +
        maxResults
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
function orderByDate(videoList) {
  var datesList = [];
  var mostRecent = [];
  for (videos of videoList) {
    datesList.push(new Date(videos.snippet.publishedAt).getTime());
  }
  for (var i = 0; i < datesList.length; i++) {
    var max = Math.max(...datesList.filter((date) => typeof date == "number"));
    var index = datesList.indexOf(max);
    mostRecent.push(index);
    datesList.splice(index, 1, "");
  }
  return mostRecent;
}

function orderByPopularity(videoList) {
  var popularVideos = [];
  var indexes = [];
  for (videos of videoList) {
    popularVideos.push(Number(videos.statistics.viewCount));
  }
  for (var i = 0; i < popularVideos.length; i++) {
    var max = Math.max(...popularVideos.filter((vid) => typeof vid == "number"));
    var index = popularVideos.indexOf(max);
    indexes.push(index);
    popularVideos.splice(index, 1, "");
  }
  return indexes;
}
//Use flickity script to create and display youtube videos
let elem = document.querySelector(".main-carousel");
let flkty;
function initializeFlkty() {
  if (flkty === undefined) {
    flkty = new Flickity(elem, {
      // options
      cellAlign: "center",
      contain: true,
      adaptiveHeight: true,
    });
  }
}
function displayVids(list) {
  checkAndDeleteOldCells();
  if (filters.children[0].getAttribute("status") === "selected") {
    createVids(Number(inputQueries.value), orderByDate(list), list);
  } else {
    createVids(Number(inputQueries.value), orderByPopularity(list), list);
  }
  initializeFlkty();
}

//make this better and more efficient; load in a bunch of divs and only have 3 iframes at a time
function createVids(quantity, orderType, list) {
  var indicesOfVids = orderType;
  for (var i = 0; i < quantity; i++) {
    const template = document.querySelector(".template_VideoFormat");
    const videoSlide = template.content.cloneNode(true).children[0];
    let title = videoSlide.querySelector(".video_title");
    let description = videoSlide.querySelector(".description");
    let video = videoSlide.querySelector(".video");
    let iframe = document.createElement("iframe");
    var vidId = list[indicesOfVids[i]].id;
    videoSlide.style.backgroundImage = `url(${
      list[indicesOfVids[i]].snippet.thumbnails.maxres.url
    })`;
    videoSlide.style.backgroundSize = "cover";
    videoSlide.style.backgroundRepeat = "no-repeat";
    title.textContent = list[indicesOfVids[i]].snippet.title;
    description.innerHTML = shortenDescription(list[indicesOfVids[i]].snippet.description);
    toggleDescriptionVisibility(description, description.innerHTML);
    iframe.title = list[indicesOfVids[i]].snippet.title;
    iframe.width = "100%";
    iframe.height = "270";
    iframe.type = "text/html";
    iframe.src = "https://www.youtube-nocookie.com/embed/" + vidId + "?rel=0";
    video.appendChild(iframe);
    document.getElementById("videosContainer").append(videoSlide);
  }
}
function shortenDescription(description) {
  let indexOfFirstQuotationMark = description.indexOf(`"`);
  if (description.indexOf("Story:") != -1) {
    let substringOfDescription = description.substring(description.indexOf(`Story:`) + 1);
    let indexOfEnd = substringOfDescription.indexOf(`----`);
    let newDescription = description.substring(
      description.indexOf("Story:"),
      indexOfEnd + (description.length - substringOfDescription.length)
    );
    return newDescription;
  } else if (
    indexOfFirstQuotationMark != -1 &&
    indexOfFirstQuotationMark < description.indexOf(".")
  ) {
    let substringOfDescription = description.substring(description.indexOf(`"`) + 1);
    let indexOfOtherQuotationMark = substringOfDescription.indexOf(`"`);
    let newDescription = description.substring(
      indexOfFirstQuotationMark,
      indexOfOtherQuotationMark + (description.length - substringOfDescription.length) + 1
    );
    return newDescription;
  } else {
    let descriptionPeriodsSplit = description.split(". ");
    let newDescription = "";
    let periodChecker = description;
    let i = 0;
    while (i < 4 && periodChecker.indexOf(". ") != -1) {
      newDescription += descriptionPeriodsSplit[i] + ". ";
      periodChecker = periodChecker.substring(periodChecker.indexOf(". ") + 1);
      i++;
    }

    return newDescription;
  }
}

function checkAndDeleteOldCells() {
  if (document.getElementById("videosContainer").children.length != 0) {
    flkty.destroy();
    flkty = undefined;
    document.getElementById("videosContainer").innerHTML = "";
  }
}
function toggleDescriptionVisibility(element, description) {
  if (description.length === 0) {
    element.setAttribute("displayed", false);
  } else if (vw < 425) {
    element.setAttribute("toggled", "false");
    element.previousElementSibling.querySelector("i").style.display = "default";
    element.previousElementSibling.addEventListener("click", function () {
      let state = element.getAttribute("toggled") === "true";
      let addedClass = state ? "fa-caret-down" : "fa-caret-up";
      let removedClass = state ? "fa-caret-up" : "fa-caret-down";
      this.querySelector("i").classList.remove(removedClass);
      this.querySelector("i").classList.add(addedClass);
      element.setAttribute("toggled", String(!state));
      flkty.reloadCells();
    });
  } else {
    element.previousElementSibling.querySelector("i").style.display = "none";
    element.setAttribute("toggled", true);
  }
}
