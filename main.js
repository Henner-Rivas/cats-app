const api_key = "d38a7199-5329-4b11-bffc-9365a8f05381";
const API_GET_RANDOM = `https://api.thecatapi.com/v1/images/search?limit=10&?api_key=${api_key}`;
const API_GET_FAVORITES = `https://api.thecatapi.com/v1/favourites`;
const API_UPLOAD = `https://api.thecatapi.com/v1/images/upload`;

const $button = document.querySelector("button");
const $favorite = document.querySelector(".favorites");
const $error = document.querySelector(".error");
const $cats = document.querySelector("#container-cat");
const $form = document.querySelector("form");

const API_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

async function getCats() {
  const response = await fetch(API_GET_RANDOM);
  if (response.status !== 200) {
    $error.innerHTML =
      "There was mistake" + response.status + " with the random cats";
  } else {
    const data = await response.json();
    data.forEach((el) => {
      $cats.insertAdjacentHTML(
        "afterbegin",
        `
          <article>
          <img src=${el.url} />
          <img class="favorite" src="./favorite.png" onclick="saveFavoriteCat('${el.id}')" />
        </article>
        `
      );
    });
  }
}

async function getFavorites() {
  const response = await fetch(API_GET_FAVORITES, {
    method: "GET",
    "Content-Type": "application/json",
    headers: {
      "x-api-key": api_key,
    },
  });
  if (response.status !== 200) {
    $error.innerHTML =
      "There was mistake" + response.status + " with the favorites";
  } else {
    const data = await response.json();
    $favorite.innerHTML = "";
    data.forEach((el) => {
      $favorite.insertAdjacentHTML(
        "afterbegin",
        `
            <article>
            <img src=${el.image.url} />
            <img class="delete" src="./delete.png"  onclick="deleteFavoriteCat('${el.id}')"/>
            </article>
          `
      );
    });
  }
}

async function deleteFavoriteCat(id) {
  await fetch(API_DELETE(id), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": api_key,
    },
  });
  getFavorites();
}
async function saveFavoriteCat(id) {
  let rawBody = JSON.stringify({
    image_id: `${id}`,
  });
  await fetch(API_GET_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": api_key,
    },
    body: rawBody,
  });
  getFavorites();
}
async function uploadPhotoCat() {
  const formData = new FormData($form);
  console.log(formData);
  const res = await fetch(API_UPLOAD, {
    method: "POST",
    headers: {
      "x-api-key": api_key,
    },
    body: formData,
  });
  const data = await res.json();
  if (res.status !== 201) {
    $error.innerText = "Hubo un error: " + res.status + " " + data.message;
  } else {
    console.log({ data });
    console.log(data.url);
    saveFavoriteCat(data.id);
    getFavorites();
  }
}
const previewImage = () => {
  const file = document.getElementById("file").files;
  if (file.length > 0) {
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      document.getElementById("preview").setAttribute("src", e.target.result);
    };
    fileReader.readAsDataURL(file[0]);
  }
};

getFavorites();
getCats();
$button.addEventListener("click", () => {
  $cats.innerHTML = "";
  getCats();
});
