const { parse } = JSON;
const { assign, create } = Object;

const by_id = id => document.getElementById(id);

const is_disclosure = element =>
  element.nodeName == 'BUTTON'
  && element.hasAttribute('aria-expanded');

function disclose(button) {
  const expanded = button.getAttribute('aria-expanded');
  const state = !parse(expanded);

  button.setAttribute('aria-expanded', state);
}

const strategy = assign(create(null), {
  copy(trigger) {
    const id = trigger.getAttribute('aria-controls');
    const source = by_id(trigger.value);
    const target = by_id(id);

    target.innerHTML = source.innerHTML
  },
  fetch(trigger) {
    fetch(`/e2e-demo/=/api/${trigger.value}.json`)
      .then(response => response.json())
      .then(function render({ title, message }) {
        const id = trigger.getAttribute('aria-controls');
        const target = by_id(id);

        target.innerHTML = `
        <h2>${title}</h2 >
        <p>${message}</p>
        `;
      });
  },
});


function onclick({ target }) {
  if (is_disclosure(target)) {
    disclose(target);
  } else if (target.hasAttribute('aria-controls')) {
    strategy[target.name](target);
  }
}

document.addEventListener('click', onclick);
