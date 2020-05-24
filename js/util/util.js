export default class Util {
  static getName(elem) {
    if (elem.KoreanName != undefined) {
      if (elem.KoreanName == "") {
        return elem.PrimaryName
      }
      return elem.KoreanName
    }

    if (elem.KoreanValue == "") {
      return elem.PrimaryValue
    }
    return elem.KoreanName
  }

  static setStatusByType(type, elem, value) {
    switch (type) {
      case "score":
        elem.Score = value
        break;
      case "own":
        elem.Own = elem.Own == 0 ? 1 : 0
        break;
      case "prev_owned":
        elem.PrevOwned = elem.PrevOwned == 0 ? 1 : 0
        break;
      case "for_trade":
        elem.ForTrade = elem.ForTrade == 0 ? 1 : 0
        break;
      case "want":
        elem.Want = elem.Want == 0 ? 1 : 0
        break;
      case "want_to_buy":
        elem.WantToBuy = elem.WantToBuy == 0 ? 1 : 0
        break;
      case "wishlist":
        elem.Wishlist = elem.Wishlist == 0 ? 1 : 0
        break;
      case "preordered":
        elem.Preordered = elem.Preordered == 0 ? 1 : 0
        break;
      case "memo":
        elem.Memo = value
        break;
    }
  }
}