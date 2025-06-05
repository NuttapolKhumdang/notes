import type { Component } from "solid-js";

const NoteNotFoundFallback: Component = () => {
  return (
    <section class="flex flex-col items-center justify-center rounded-xl border border-neutral-200 py-8 text-neutral-600">
      <span>ไม่พบโน้ต</span>
      <span>ลองเพิ่มโน้ตใหม่ดูสิ!</span>
    </section>
  );
};

export default NoteNotFoundFallback;
