// import { CKEditor } from '@ckeditor/ckeditor5-react'
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { useEffect, useRef, useState } from 'react'

function Editor({ onChange, name, value }) {
  const editorRef = useRef()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    try {
      loadEditor().then(() => {
        setEditorLoaded(true)
      })
    } catch (error) {
      console.log(error)
    }
  }, [editorLoaded])

  const loadEditor = async () => {
    try {
      if (!editorRef.current) {
        return Promise.resolve(
          (editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
          })
        )
      }

      return Promise.resolve(editorRef.current)
    } catch (error) {
      setEditorLoaded(true)
      console.log(error)
    }
  }

  return (
    <div>
      {editorLoaded ? (
        <CKEditor
          type=''
          name={name}
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData()

            onChange(data)
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  )
}

export default Editor
