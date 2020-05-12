export default class Popup {
  static show(title, body, callback) {
    $('.modal').find('.modal-title').html(title)
    $('.modal').find('.modal-body > p').html(body)
    $('.modal').modal('show')
    $('.modal').on('hidden.bs.modal', callback)
  }
}