class DialogElement extends HTMLElement {

  constructor () {
    super()
    let shadowRoot = this.attachShadow({ mode: 'closed' })

    shadowRoot.innerHTML = `
      <style>
        .dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 15000;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          min-width: 700px;
          min-height: 500px;
          background: #fff;
          box-shadow: 0 0 6px #ccc;
          border-radius: 3px;
        }

        .dialog-close {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          font-weight: normal;
          font-style: normal;
          font-size: 20px;
          color: #666;
          cursor: default;
        }

        .dialog-header,
        .dialog-footer,
        .dialog-body {
          padding: 10px;
        }

        .dialog-body {
          flex: 1;
        }

        .dialog-mask {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, .7);
        }
      </style>
      <div class="dialog-mask"></div>
      <article class="dialog">
        <i class="dialog-close">&times;</i>
        <header class="dialog-header">
          <slot name="header"></slot>
        </header>
        <section class="dialog-body">
          <slot></slot>
        </section>
        <footer class="dialog-footer">
          <slot name="footer"></slot>
        </footer>
      </article>
    `
  }

  get open () {
    return !this.hasAttribute('hidden')
  }

  set open (value) {
    if (value) {
      this.removeAttribute('hidden')
    } else {
      this.setAttribute('hidden', 'hidden')
    }
  }
}
