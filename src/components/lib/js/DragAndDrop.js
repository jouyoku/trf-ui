import { ref, computed, watch, set } from "@vue/composition-api";
import { isNameAlphanumeric } from "./utils.js";

export default function (list, client) {
  const _list = ref(list);
  const _client = client;

  const _name = ref(_client.name);

  const dragging = ref(-1);
  const current = client.current ? ref(client.current) : ref(-1);
  const dragOver = ref(-1);

  const onDrag = (event, i) => {
    dragging.value = i;
  };

  const onDragOver = (event, i) => {
    event.preventDefault();
    dragOver.value = i;
  };

  const onDrop = (event, i) => {
    event.preventDefault();
    if (i == dragging.value) {
      dragging.value = -1;
      return;
    }
    if (_client.preOnDrop) {
      _client.preOnDrop(dragging.value, i);
    }
    _list.value.splice(i, 0, _list.value.splice(dragging.value, 1)[0]);
    current.value = i;
    _client.select(i);
    dragging.value = -1;
  };

  const add = () => {
    if (_client.preAdd) {
      _client.preAdd(current.value + 1);
    }
    _list.value.splice(current.value + 1, 0, _client.gen());
    current.value = current.value + 1;
  };

  const change = () => {
    if (_client.preChange) {
      _client.preChange(current.value);
    }
    set(_list.value, current.value, _client.gen());
    _client.select(current.value);
  };

  const remove = () => {
    if (_client.preRemove) {
      _client.preRemove(current.value);
    }
    _list.value.splice(current.value, 1);
    if (_list.value.length <= current.value) {
      current.value = _list.value.length - 1;
    }
  };

  watch(
    current,
    (newVal, oldVal) => {
      _client.select(newVal);
    },
    {
      deep: true,
      sync: true,
    }
  );

  const isNameNew = computed(() => {
    for (var i = 0; i < _list.value.length; i++) {
      if (_list.value[i].hasOwnProperty("name")) {
        if (_list.value[i].name === _name.value) return false;
      }
    }

    return isNameAlphanumeric(_name.value);
  });

  return {
    dragging,
    dragOver,
    onDrag,
    onDragOver,
    onDrop,
    current,
    add,
    change,
    remove,
    isNameNew,
  };
}
