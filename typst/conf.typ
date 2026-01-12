#let conf(
  title: none,
  authors: (),
  abstract: [],
  doc,
) = {
  set page(
    paper: "us-letter",
    header: align(right + horizon, title),
    numbering: "1",
    columns: 2,
  )
  set par(justify: true)
  set text(
    font: "Libertinus Serif",
    size: 11pt,
  )

  show heading.where(level: 1): it => block(width: 100%)[
    #set align(center)
    #set text(13pt, weight: "regular")
    #block(smallcaps(it.body))
  ]

  show heading.where(level: 2): it => text(
    size: 11pt,
    weight: "regular",
    style: "italic",
    it.body + [.],
  )

  place(
    top + center,
    float: true,
    scope: "parent",
    clearance: 2em,
    {
      set align(center)
      text(17pt, title)

      let count = authors.len()
      let ncols = calc.min(count, 3)
      grid(
        columns: (1fr,) * ncols,
        row-gutter: 24pt,
        ..authors.map(author => [
          #author.name \
          #author.affiliation \
          #link("mailto:" + author.email)
        ]),
      )

      par(justify: false)[
        *Abstract* \
        #abstract
      ]
    },
  )

  set align(left)
  doc
}
