//Полифилл метода массивов from

if (!Array.from) {
  Array.from = (function () {
    let symbolIterator;
    try {
      symbolIterator = Symbol.iterator
        ? Symbol.iterator
        : 'Symbol(Symbol.iterator)';
    } catch (e) {
      symbolIterator = 'Symbol(Symbol.iterator)';
    }

    let toStr = Object.prototype.toString;
    let isCallable = function (fn) {
      return (
        typeof fn === 'function' ||
        toStr.call(fn) === '[object Function]'
      );
    };
    let toInteger = function (value) {
      let number = Number(value);
      if (isNaN(number)) return 0;
      if (number === 0 || !isFinite(number)) return number;
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    let maxSafeInteger = Math.pow(2, 53) - 1;
    let toLength = function (value) {
      let len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    let setGetItemHandler = function setGetItemHandler(isIterator, items) {
      let iterator = isIterator && items[symbolIterator]();
      return function getItem(k) {
        return isIterator ? iterator.next() : items[k];
      };
    };

    let getArray = function getArray(
      T,
      A,
      len,
      getItem,
      isIterator,
      mapFn,
    ) {
      let k = 0;

      while (k < len || isIterator) {
        let item = getItem(k);
        let kValue = isIterator ? item.value : item;

        if (isIterator && item.done) {
          return A;
        } else {
          if (mapFn) {
            A[k] =
              typeof T === 'undefined'
                ? mapFn(kValue, k)
                : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
        }
        k += 1;
      }

      if (isIterator) {
        throw new TypeError(
          'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1',
        );
      } else {
        A.length = len;
      }

      return A;
    };

    return function from(arrayLikeOrIterator /*, mapFn, thisArg */) {
      let C = this;

      let items = Object(arrayLikeOrIterator);
      let isIterator = isCallable(items[symbolIterator]);

      if (arrayLikeOrIterator == null && !isIterator) {
        throw new TypeError(
          'Array.from requires an array-like object or iterator - not null or undefined',
        );
      }

      let mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      let T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) {
          throw new TypeError(
            'Array.from: when provided, the second argument must be a function',
          );
        }

        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      let len = toLength(items.length);

      let A = isCallable(C) ? Object(new C(len)) : new Array(len);

      return getArray(
        T,
        A,
        len,
        setGetItemHandler(isIterator, items),
        isIterator,
        mapFn,
      );
    };
  })();
}

//Полифилл closest

(function (ELEMENT) {
  ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
  ELEMENT.closest = ELEMENT.closest || function closest(selector) {
    if (!this) return null;
    if (this.matches(selector)) return this;
    if (!this.parentElement) {
      return null;
    } else return this.parentElement.closest(selector);
  };
}(Element.prototype));
