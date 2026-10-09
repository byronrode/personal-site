function resolveBuildReference(head, dirty, requested) {
  if (requested && requested !== head) throw new Error('Release source SHA must match the committed checkout');
  if (dirty) return '';
  if (!/^[a-f0-9]{40}$/i.test(head)) throw new Error('Exact committed source SHA required');
  return head;
}
module.exports = {resolveBuildReference};
