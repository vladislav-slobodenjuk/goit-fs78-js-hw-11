export function createGalleryMarkup(items) {
  return items
    .map(item => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = item;
      return `<div class="col">
                <div class="card photo-card">
                  <a class="gallery__link" href=${largeImageURL}>
                    <img
                      src=${webformatURL.replace('_640', '_340')}
                      alt='${tags}'
                      class="card-img-top object-fit-cover"
                      loading="lazy"
                      style="height: 200px;"
                    />
                  </a>
                  <div class="info card-body d-flex justify-content-between p-2">
                    <p class="info-item card-text small m-0">
                      <b>Likes</b>
                      ${likes}
                    </p>
                    <p class="info-item card-text small m-0">
                      <b>Views</b>
                      ${views}
                    </p>
                    <p class="info-item card-text small m-0">
                      <b>Comments</b>
                      ${comments}
                    </p>
                    <p class="info-item card-text small m-0">
                      <b>Downloads</b>
                      ${downloads}
                    </p>
                  </div>
                </div>
              </div>`;
    })
    .join('');
}
