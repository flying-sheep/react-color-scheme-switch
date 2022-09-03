import './style.css'
import MDXContent from './index.mdx'
// eslint-disable-next-line import/extensions
import ReactDOM from 'react-dom/client'

const root = ReactDOM.createRoot(document.querySelector('main')!)
root.render(<MDXContent/>)
