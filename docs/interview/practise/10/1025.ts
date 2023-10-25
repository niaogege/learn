/**
 * 1.图片懒加载
 * 2.
 */

function lazyLoadImg(imgs) {
  const observe = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, intersectionRatio } = entry;
      if (intersectionRatio > 0) {
        target.src = target.dataset.src;
        observe.unobserve(target);
      }
    });
  });
  imgs.forEach((img) => {
    observe.observe(img);
  });
}
