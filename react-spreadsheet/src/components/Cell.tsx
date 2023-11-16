import { useState, useEffect } from 'react'

type Props = {
  value: string
  x: number
  y: number
  updateValue: (x: number, y: number, value: string) => void
}

export default function Cell({ value, x, y, updateValue }: Props) {
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    window.document.addEventListener('unselectAll', () => {
      setSelected(false)
    })
  }, [])

  if (selected) {
    return (
      <input
        className='p-3 border-2'
        value={value}
        onChange={(e) => {
          updateValue(x, y, e.target.value)
        }}
      />
    )
  }

  return (
    <div
      className='p-3 border-2'
      onClick={() => {
        window.document.dispatchEvent(new Event('unselectAll'))
        setSelected(true)
      }}>
      {value || <span className='text-gray-200'>-</span>}
    </div>
  )
}
