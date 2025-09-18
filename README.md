# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Forms

This project uses **Formspree** for two public-facing forms:

* **Request an Edit**  
* **Submit a Brand**

### Setup

1. In Formspree, create two forms (Project or Personal):  
   &nbsp;&nbsp;• *Request Edit*  
   &nbsp;&nbsp;• *Submit Brand*
2. Copy each form’s endpoint URL (looks like `https://formspree.io/f/XXXXXXX`).
3. Add the endpoints as environment variables—either in a local `.env` file or in your hosting provider’s env settings:

   ```env
   # .env
   FORMSPREE_EDIT_ID=https://formspree.io/f/XXXXXXXX
   FORMSPREE_SUBMIT_ID=https://formspree.io/f/XXXXXXXX
   ```

   If you prefer using Vite-exposed variables, the app also accepts:

   ```env
   PUBLIC_FORMSPREE_EDIT_ID=XXXXXXXX    # or full URL
   PUBLIC_FORMSPREE_SUBMIT_ID=XXXXXXXX  # or full URL
   ```

### Notes

* Both forms include basic spam protection:  
  &nbsp;&nbsp;• A hidden *honeypot* field  
  &nbsp;&nbsp;• A client-side *time gate* (must spend a few seconds on the page)
* Successful submissions redirect to `/for-brands/thanks?type=edit` or `/for-brands/thanks?type=submit`.
* Plausible Analytics events fired on success:  
  &nbsp;&nbsp;• `edit_request_success`  
  &nbsp;&nbsp;• `brand_submit_success`

### Privacy

Submissions are processed by **Formspree**. Review their privacy policy for details on data handling.  
If your site has its own privacy policy, link to it (e.g., in the footer or near each form) so users understand how their information is used.
