<script lang=ts>
  import './markdown.css'

  let { html } = $props();
</script>

<div class="markdown-body">
  {@html html}
</div>

