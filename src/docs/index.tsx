import 'https://cdn.jsdelivr.net/npm/@exampledev/new.css@1/new.min.css'
import 'https://esm.sh/prism-themes@1.9.0/themes/prism-synthwave84.css'

import MDXContent from './index.mdx'
import ReactDOM from 'react-dom/client.js'

const root = ReactDOM.createRoot(document.querySelector('main')!)
root.render(<MDXContent/>)
