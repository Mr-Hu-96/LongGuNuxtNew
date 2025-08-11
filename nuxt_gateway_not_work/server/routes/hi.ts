import { do_replace } from "~/functions/common.ts";

export default defineEventHandler(async (event) => {
  const targetUrl = 'http://127.0.0.1:5173' + do_replace(event.path, '/hi', ''); // may have bug by doing global replacement
  const response = await $fetch(targetUrl);
  const modifiedHtml = response.replace('</head>', '<meta name="author" content="yingshaoxo"></head>');
  return modifiedHtml;
});

