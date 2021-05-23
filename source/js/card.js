import {descriptions, descriptionsDisabled} from './data';

const cardsContainer = document.querySelector('.products__list');
const cards = document.querySelectorAll('.card');
const extraTexts = document.querySelectorAll('.card__extra-text');
const note = document.querySelector('.card__note');

const noteDefault = note.textContent;
const noteSelected = 'Котэ не одобряет?';

const defaultExtraText = Array.from(extraTexts).map(content => content.textContent);

const setDisabledCard = () => {
  Array.from(cards).forEach((card, i) => {
    if (card.classList.contains('card--disabled')) {
      const mainContent = card.querySelector('.card__main-content');
      const extraContent = card.querySelector('.card__extra-content');

      mainContent.tabIndex = '-1';
      extraContent.textContent = descriptionsDisabled[i];
    }
  });
};

setDisabledCard();

const onCardClick = (evt) => {
  evt.preventDefault();

  const card = evt.target.closest('.card');

  if (card) {
    const mainContent = card.querySelector('.card__main-content');
    const includeMainContent = evt.target.closest('.card__main-content');
    const note = card.querySelector('.card__note');
    const extraText = card.querySelector('.card__extra-text');
    const linkWrap = card.querySelector('.card__link-wrap');

    const isSelectedCard = !card.classList.contains('card--selected');
    const isSelectedHoverCard = card.classList.contains('card--selected-hover');
    const isDisabledCard = card.classList.contains('card--disabled');
    const isCardLink = evt.target.matches('.card__link');

    const removeSelectedClasses = () => {
      card.classList.remove('card--selected');
      card.classList.remove('card--selected-hover');

    };

    const onEnterContent = () => {
      card.classList.remove('card--selected');
      card.classList.add('card--selected-hover');
      note.textContent = noteSelected;
    };

    const onLeaveContent = () => {
      card.classList.add('card--selected');
      card.classList.remove('card--selected-hover');
      note.textContent = noteDefault;
    };

    const addHoverListeners = () => {
      mainContent.onmouseleave = onLeaveContent;
      mainContent.onmouseenter = onEnterContent;
    };

    const removeHoverListeners = () => {
      mainContent.onmouseleave = null;
      mainContent.onmouseenter = null;
    };

    const changeTextDesc = () => {
      Array.from(cards).forEach((cardElement, i) => {
        if (card === cardElement) {
          extraText.textContent = descriptions[i];
          linkWrap.classList.add('card__link-wrap--hidden');

          if (!isSelectedCard || isSelectedHoverCard) {
            extraText.textContent = defaultExtraText[i];
            linkWrap.classList.remove('card__link-wrap--hidden');
          }
        }
      });
    };

    const isCurrentTarget = () => {
      return (includeMainContent || isCardLink) && !isDisabledCard;
    };

    const setBehaviourCard = () => {
      note.textContent = noteDefault;

      isSelectedCard ? addHoverListeners() : removeHoverListeners();

      card.classList.toggle('card--selected');

      if (isSelectedHoverCard) {
        removeSelectedClasses();
        removeHoverListeners();
      }

      changeTextDesc();
    };

    if (isCurrentTarget()) {
      setBehaviourCard();
    }
  }
};

cardsContainer.addEventListener('click', onCardClick);
