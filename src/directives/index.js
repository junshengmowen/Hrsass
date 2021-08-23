export const imageerror = {
  inserted(el, binding) {
    el.onerror = function() {
      el.src = binding.value
    }
  }
}
