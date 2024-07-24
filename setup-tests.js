import '@testing-library/jest-dom'

beforeAll(() => {
  HTMLDialogElement.prototype.show = jest.fn()
  HTMLDialogElement.prototype.showModal = jest.fn()
})
