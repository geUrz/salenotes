import { FaTimes } from 'react-icons/fa'
import styles from './NoteForm.module.css'
import { Form, FormField, FormGroup, Label } from 'semantic-ui-react'

export function NoteForm() {
  return (
    
    <>
    
      <div className={styles.iconClose} onClick={onOpenClose}>
        <FaTimes />
      </div>

      <div className={styles.section}>
        <Form>
          <FormGroup>
            <FormField>
              <Label>
                
              </Label>
            </FormField>
          </FormGroup>
        </Form>
      </div>

    </>

  )
}
