import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { Note } from '../Note'
import { useEffect, useState } from 'react'
import styles from './ListNotes.module.css'

export function ListNotes(props) {

  const {reload, onReload} = props

  const [note, setNote] = useState()

  useEffect(() => {
    (async() => {
      try {
        const response = await fetch('api/getNotes')
        const result = await response.json()
        setNote(result)
      } catch (error) {
          console.error('Error fetching data:', error)
      }
    })()
  }, [reload])

  return (
    
    <>
    
      {!note ? (
        <Loading />
      ) : (
        size(note) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.section}>
            {map(note, (not) => (
              <Note 
                key={not.id}
                noteId={not.id}
                note={not}
                onReload={onReload}
              />
            ))}
          </div>
        )
      )}
    
    </>

  )
}
