import { useState } from 'react'
import * as M from '@material-ui/core'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import * as H from '../../hooks'

const useStyles = M.makeStyles((theme) => ({
  inputArea: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'auto',
  },
  inputs: {
    resize: 'none',
    alignSelf: 'stretch',
    flex: '1 1 auto',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    margin: '1rem',
  },
  scriptSelector: {
    border: 'solid 1px',
    alignSelf: 'center',
  },
}))

const getScriptsInfo = () =>
  [...PSC.PaliScriptInfo.keys()].map((k) => ({
    id: k,
    name: PSC.getLocaleNameForScript(k),
  }))

export const Converter = () => {
  const classes = useStyles()
  const [script] = H.useLocalStorageState<string>(PSC.Script.RO, 'currentScript')
  const initialText = PSC.convertAny(
    // eslint-disable-next-line max-len
    'manopubbaṅgamā dhammā\nmanoseṭṭhā manomayā\nmanasā ce pasannena\nbhāsati vā karoti vā\ntato naṁ sukhamanveti\nchāyā va anapāyinī',
    script,
  )
  const [inputText, setInputText] = useState(initialText)
  const [convertedText, setConvertedText] = useState('')

  const convertInputs = (e: any) => {
    setConvertedText(
      inputText
        .split('\n')
        .map((s1: string) => PSC.convertAny(s1, e.target.value))
        .join('\n'),
    )
  }

  const handleChangedInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  return (
    <div className={classes.inputArea}>
      <textarea className={classes.inputs} value={inputText} onChange={handleChangedInputText} />
      <M.Select native className={classes.scriptSelector} onChange={convertInputs} multiple>
        {getScriptsInfo().map((si) => (
          <option key={si.id} value={si.id}>
            {si.name}
          </option>
        ))}
      </M.Select>
      <textarea className={classes.inputs} readOnly value={convertedText} />
    </div>
  )
}

export default Converter
