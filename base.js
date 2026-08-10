const curr_route = window.location.href.replaceAll(window.location.origin, "");

document.querySelectorAll("[data-load]").forEach((element) => {
  const href = element.getAttribute("data-load");
  const id = element.getAttribute("data-id");
  fetch(href)
    .then((response) => {
      return response.text();
    })
    .then(
      (data) => {
        element.innerHTML = data;
        if (id) {
          element.setAttribute("id", id);
        }
      },
      (error) => {
        console.log(error);
      }
    );
});

const stickyNavbar = () => {
  document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 200) {
        document.getElementById("navbar").classList.add("fixed-top");
        // add padding top to show content behind navbar
        navbar_height = document.querySelector(".navbar").offsetHeight;
        document.body.style.paddingTop = navbar_height + "px";
      } else {
        document.getElementById("navbar").classList.remove("fixed-top");
        // remove padding top from body
        document.body.style.paddingTop = "0";
      }
    });
  });
};

const marquee = () => {
  let val = 0;
  fetch("./files/config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const texts = data.marquee;
      const changeMarquee = (text) => {
        val++;
        if (val >= texts.length) {
          val = 0;
        }
        document.getElementById("change_marquee")?.classList.add("fade-out");
        setTimeout(() => {
          document.getElementById("change_marquee").innerHTML = text;
          setTimeout(() => {
            document
              .getElementById("change_marquee")
              ?.classList.remove("fade-out");
          }, 500);
        }, 500);
      };
      changeMarquee(`<strong>${texts[val]}</strong>`);
      if (texts.length > 0) {
        setInterval(() => {
          changeMarquee(`<strong>${texts[val]}</strong>`);
        }, 5000);
      }
    });
};
const updateCopyrightYear = () => {
  document.querySelector("#year_autoupdate").innerHTML = new Date()
    .getFullYear()
    .toString();
};

const linkSubmit = () => {
  document.querySelectorAll(".submit_link").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = e.target.getAttribute("data-submit");
    });
  });
};

const setActiveCountdown = (activeDate) => {
  const now = new Date();
  const distance = activeDate.date - now;
  if (distance > 0) {
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.querySelector(
      "#countDownTimer"
    ).innerHTML = `<strong>Next Event: </strong><br>${activeDate.name}<br>
        (${days}d ${hours}h ${minutes}m ${seconds}s)`;
  } else {
    document.querySelector(
      "#countDownTimer"
    ).innerHTML = `<strong>Next Event: </strong><br>${activeDate.name}
        0d 0h 0m 0s`;
  }
  return "{{CountdownTimerProgress}}";
};

const loadDates = () => {
  fetch("./files/config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const dates = data.dates;
      let isActive = false;
      let activeDate = {
        date: null,
        event: null,
      };
      const elem = document.querySelector("#conference_dates");
      elem.innerHTML = "";
      if (dates.length > 0) {
        dates.forEach((data) => {
          date = "";
          let hasPassed = true;
          for (let i = 0; i < data.date.main.length; i++) {
            e = new Date(data.date.main[i]);
            date += `${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
            if (e > new Date()) {
              hasPassed = false;
            }
            if (i < data.date.main.length - 1) {
              date += ", ";
            }
            if (!hasPassed && isActive == false) {
              activeDate.date = e;
              activeDate.name = data.name;
            }
          }
          if (data.date.extended != null) {
            e = new Date(data.date.extended);
            date = `<s>${date}</s>
                        <div style="display: flex; justify-content: end">
                            <div class="tags has-addons" style="margin: 0; padding: 0">
                                <span class="tag is-dark">${e.getDate()}/${
              e.getMonth() + 1
            }/${e.getFullYear()}</span>
                                <span class="tag is-info">Extended</span>
                            </div>
                        </div>`;
            if (!hasPassed && isActive == false) {
              activeDate.date = e;
              activeDate.name = data.name;
            }
          }
          if (hasPassed) {
            document.querySelector(
              ".timeline-preview-inc4 .flex-parent .input-flex-container"
            ).innerHTML += `<div class="input">
                    <span data-year="${date}" data-info="${data.name}"></span>
                </div>`;
          } else if (isActive == false) {
            document.querySelector(
              ".timeline-preview-inc4 .flex-parent .input-flex-container"
            ).innerHTML += `<div class="input active">
                    <span data-year="${date}" data-info="${data.name}"></span>
                </div>`;
            isActive = true;
          } else {
            document.querySelector(
              ".timeline-preview-inc4 .flex-parent .input-flex-container"
            ).innerHTML += `<div class="input">
                    <span data-year="${date}" data-info="${data.name}"></span>
                </div>`;
          }
        });
        if (activeDate != null) {
          elem.innerHTML += `<br>
                ${
                  data.link.active == true
                    ? `<div><a href="${data.link.link}" target="_blank"><button class="button is-link">Submit Paper</button></a></div><br>`
                    : ``
                } 
                <div class="notification is-warning is-light" id="countDownTimer"></div>`;
          setActiveCountdown(activeDate);
          setInterval(() => {
            setActiveCountdown(activeDate);
          }, 1000);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const options = { year: "numeric", month: "long", day: "numeric" };

const loadDatesFullPage = () => {
  fetch("./files/config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const dates = data.dates;
      let isActive = false;
      let activeDate = {
        date: null,
        event: null,
      };
      const elem = document.querySelector("#conference_dates");
      elem.innerHTML = "";
      if (dates.length > 0) {
        const table = document.createElement("table");
        table.classList.add("table");
        table.classList.add("is-fullwidth");
        table.classList.add("is-hoverable");
        table.classList.add("is-striped");
        table.classList.add("is-bordered");
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerHTML = "Event";
        const th2 = document.createElement("th");
        th2.innerHTML = "Date";
        tr.appendChild(th1);
        tr.appendChild(th2);
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        dates.forEach((data) => {
          const tr = document.createElement("tr");
          const td1 = document.createElement("td");
          const td2 = document.createElement("td");
          const td3 = document.createElement("td");
          td1.innerHTML = data.name;
          let hasPassed = true;
          for (let i = 0; i < data.date.main.length; i++) {
            e = new Date(data.date.main[i]);
            td2.innerHTML += e.toLocaleDateString("en-US", options);
            if (e > new Date()) {
              hasPassed = false;
            }
            if (i < data.date.main.length - 1) {
              td2.innerHTML += " <strong>/</strong> ";
            }
            if (!hasPassed && isActive == false) {
              activeDate.date = e;
              activeDate.name = data.name;
            }
          }
          if (data.date.extended != null) {
            e = new Date(data.date.extended);
            td2.innerHTML = `<s>${date}</s>
                    <div style="display: flex; justify-content: end">
                        <div class="tags has-addons" style="margin: 0; padding: 0">
                            <span class="tag is-dark">${e.getDate()}/${
              e.getMonth() + 1
            }/${e.getFullYear()}</span>
                            <span class="tag is-info">Extended</span>
                        </div>
                    </div>`;
            if (!hasPassed && isActive == false) {
              activeDate.date = e;
              activeDate.name = data.name;
            }
          }
          tr.appendChild(td1);
          if (hasPassed) {
            tr.classList.add("has-text-grey-light");
          } else if (isActive == false) {
            td2.innerHTML = `<strong>${td2.innerHTML}</strong>`;
            tr.appendChild(td2);
            tr.classList.add("has-text-grey-dark");
            isActive = true;
          }
          tr.appendChild(td2);
          tbody.appendChild(tr);
          if (data.name === "Registration Hard Deadline") {
            td2.innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://in.explara.com/e/2024-inc4" target="_blank"><button class="custom-button">Register</button></a>`;
            tr.appendChild(td2);
          }
          if (
            data.name === "Computing Algorithms for Geospatial Data Workshop"
          ) {
            td2.innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://in.explara.com/e/2024-inc4" target="_blank"><button class="custom-button">Register</button></a>`;
            tr.appendChild(td2);
          }
        });
        if (activeDate != null) {
          elem.innerHTML += `<br>
                <div class="notification is-warning is-light"><div id="countDownTimer" class="text-center"></div>
                ${
                  data.link.active
                    ? `<div><a href="${data.link.link}" target="_blank"><button class="button is-link">Submit Paper</button></a></div>`
                    : ``
                }
                </div>`;
          setActiveCountdown(activeDate);
          setInterval(() => {
            setActiveCountdown(activeDate);
          }, 1000);
        }
        table.appendChild(tbody);
        elem.appendChild(table);
      }
    });
};

const isSubmissionLinkActive = () => {
  fetch("./files/config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const elem = document.querySelector("#isSubmissionLinkActive");
      if (data.link.active) {
        elem.innerHTML += `<i>InC4 2024 Updates</i><ul style="all: unset"><li style="margin: 0 0 0 30px"><a href="${data.link.link}" target="_blank"><span class="tag is-danger">Update</span> The Link for submission is active. Click here know more.</li></ul></a>`;
      } else {
        elem.innerHTML += `<i>InC4 2024 Updates</i><ul style="all: unset"><li style="margin: 0 0 0 30px">The submission link has been disabled.</li></ul></a>`;
      }
    });
};

const conditionalFunctions = () => {
  let x = window.location.href.split("/");
  x = x[x.length - 1];
  if (x == "speakers.html") {
    document.querySelectorAll(".speaker_list .card").forEach((e) => {
      e.addEventListener("click", (e) => {
        let href = e.currentTarget.getAttribute("data-redirect");
        window.open(href, "_blank");
      });
    });
  }
};

const addLinkIfActive = () => {
  fetch("./files/config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.link.active) {
        document.querySelector(
          "#get_link_url"
        ).innerHTML = `<a href="${data.link.link}" target="_blank">To submit your paper, click here or go to ${data.link.link}</a>`;
      } else {
        document.querySelector(
          "#get_link_url"
        ).innerHTML = `The submission link has been disabled by the administrator.`;
      }
    })
    .catch(() => {});
};

const loadGallery = () => {
  fetch("./files/config.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const gallery = data.gallery;
      const elem = document.querySelector("#gallery");
      for (let i in gallery) {
        console.log(gallery[i]);
        elem.innerHTML += `
            <a href="${gallery[i].img}" data-sub-html="<h3 class='is-size-5'>${gallery[i].name}</h3>${gallery[i].subtitle}">
                <img src="${gallery[i].img}" />
            </a>`;
      }
      jQuery("#gallery")
        .justifiedGallery({
          rowHeight: 180,
          margins: 5,
        })
        .on("jg.complete", function () {
          window.lightGallery(document.getElementById("gallery"), {
            autoplayFirstVideo: false,
            pager: false,
            galleryId: "nature",
            plugins: [lgZoom, lgThumbnail],
            mobileSettings: {
              controls: true,
              showCloseIcon: true,
              download: false,
              rotate: false,
            },
          });
        });
    });
};

if (curr_route == "/" || curr_route == "index.html") {
  loadDates();
  isSubmissionLinkActive();
}

if (curr_route == "/dates.html") {
  loadDatesFullPage();
}

if (curr_route == "/gallery.html") {
  loadGallery();
}

if (curr_route == "/call_for_papers.html") {
  addLinkIfActive();
}

window.onload = () => {
  stickyNavbar();
  marquee();
  linkSubmit();
  updateCopyrightYear();
  conditionalFunctions();
};

// Path: base.js
// Description: This is the base js file for the project. It contains all the common functions used in the project.
