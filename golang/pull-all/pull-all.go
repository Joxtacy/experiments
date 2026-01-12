package main

import (
	"fmt"
	"os"

	"github.com/urfave/cli/v2"
)

func main() {
	fmt.Println("hi")
	app := &cli.App{
		Name:        "greet",
		Version:     "0.1.0",
		Args:        true,
		Description: "This is how we describe greet the app",
		Authors: []*cli.Author{
			{Name: "Harrison", Email: "harrison@lolwut.com"},
			{Name: "Oliver Allen", Email: "oliver@toyshop.com"},
		},
		Flags: []cli.Flag{
			&cli.StringFlag{Name: "name", Value: "bob", Usage: "a name to say"},
		},
		Commands: []*cli.Command{
			{
				Name:        "describeit",
				Aliases:     []string{"d"},
				Usage:       "use it to see a description",
				Description: "This is how we describe describeit the function",
				Action: func(c *cli.Context) error {
					name := c.Value("name")
					fmt.Printf("i like to describe things ")
					fmt.Printf("%s", name)
					return nil
				},
			},
			{
				Name:        "herp",
				Aliases:     []string{"h"},
				Usage:       "herp derp",
				Description: "longer herp derp",
				Action: func(c *cli.Context) error {
					name := c.Value("name")
					fmt.Printf("merp ")
					fmt.Printf("%s", name)
					return nil
				},
			},
		},
	}
	_ = app.Run(os.Args)
}
