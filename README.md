# Meta Secret landing page

The public home of [Meta Secret](https://meta-secret.org): an open-source project building device-controlled ways to protect passwords, identities, and high-value secrets.

The site introduces two project families:

- [id0](https://id0.app), the advanced distributed Meta Secret implementation.
- [Nook](https://nokey.sh), the lightweight local-first family with [Simple Vault](https://simple.nokey.sh) and [Sentinel Vault](https://sentinel.nokey.sh).

## Development

The site is intentionally dependency-free. Serve the repository root with any static HTTP server:

```sh
python3 -m http.server 4173
```

Validate and build the deployable artifact with:

```sh
npm run check
npm run build
```

Pushes to `main` deploy automatically through GitHub Actions and GitHub Pages.

## License

[MIT](LICENSE)
