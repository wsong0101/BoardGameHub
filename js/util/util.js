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
}