import { css } from 'molcss'
import BottomSheet from './BottomSheet'
import { useHistoryState } from './useHistoryState'

const buttonStyle = css`
  appearance: none;
  padding: 0.5em 2em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  background-color: #fff;
  color: #000;
`

const codeStyle = css`
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 2px;
`

function App() {
  const [dialog1Open, setDialog1Open, closeDialog1] = useHistoryState<true>('dialog1', () => '#dialog1')
  const [dialog2Open, setDialog2Open, closeDialog2] = useHistoryState<true>('dialog2', () => '#dialog2')

  return (
    <section>
      <h1>下スワイプで閉じる Bottom Sheet</h1>
      <p>実装してみました。</p>

      <section>
        <h2>短いコンテンツ</h2>
        <p>コンテンツのスクロールなし</p>
        <button className={buttonStyle} onClick={() => setDialog1Open(true)}>
          開く
        </button>
        <BottomSheet open={!!dialog1Open} onRequestClose={closeDialog1}>
          <p>
            中身が短いときの表示です。<br />
            本当はコンテンツの高さに合わせたかったのですが、一旦は高さ固定で実装しました。
          </p>
          <p>
            下スワイプで閉じることができます。<br />
            マウスでも、上へのスクロールで同様の動きになります。
          </p>
        </BottomSheet>
      </section>

      <section>
        <h2>長いコンテンツ</h2>
        <p>コンテンツのスクロールあり</p>
        <button className={buttonStyle} onClick={() => setDialog2Open(true)}>
          開く
        </button>
        <BottomSheet open={!!dialog2Open} onRequestClose={closeDialog2}>
          <p>
            中身が長いときの表示です。スクロールします。<br />
            スクロール用に
            <code className={codeStyle}>height: 200vh;</code>
            のコンテンツを置いています。
          </p>
          <p>
            下スワイプで閉じることができます。<br />
            マウスでも、上へのスクロールで同様の動きになります。
          </p>
          <p>
            以下、スクロール用の余白
          </p>
          <div className={css`height: 200vh; border: 4px dashed #bbb; border-radius: 4px;`}>
          </div>
        </BottomSheet>
      </section>

      <section>
        <h2>リンクとか</h2>
        <ul>
          <li>
            <a href="https://qiita.com/iMasanari/private/4193c9d491d11da82afe">
              紹介記事（Qiita アドベントカレンダー）
            </a>
          </li>
          <li>
            <a href="https://github.com/iMasanari/react-bottom-sheet-demo">
              ソースコード（Github）
            </a>
          </li>
        </ul>
      </section>
    </section>
  )
}

export default App
