<slot />

<style>
  /* Use :global() to target the <body> element of the document */
  :global(body) {
    /* Hide the scrollbar */
    overflow: hidden;

    /* Ensure no unwanted margins/padding push content out */
    margin: 0;
    padding: 0;
  }

  /* Optional: Ensure the root element doesn't cause overflow */
  :root {
    overflow: hidden;
  }
</style>
