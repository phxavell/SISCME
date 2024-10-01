import {templateDescricao1} from "@infra/integrations/__mocks__/ocorrencias_mock.ts"

export const gerarHtmlTemplate = (descricao: string) => {
	return `<html>
  <body>
    <style>

      strong{
        font-weight: 900;
        font-family:'Lato Bold';
      }
       i{
        font-family:'Arial Italic';
      }
      em{

      font-family:'Arial Italic';
      }
    </style>
     ${descricao}
  </body>
</html>
`
}
export const htmlTemplate = `<html>
  <body>
    <style>
      .my-heading4 {
        background: darkgreen;
        color: white;
      }
      pre {
        background-color: #eee;
        padding: 10px;
      }
      strong{
        font-weight: 900;
        /*font-family:'Lato Bold';*/
      }
    </style>
     ${templateDescricao1}

  </body>
</html>
`
