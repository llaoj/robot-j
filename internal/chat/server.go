package chat

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/llaoj/robot-j/internal/GPT"
)

type Server struct {
	gpt *GPT.GPT
	ctx context.Context
}

func NewServer(gpt *GPT.GPT, ctx context.Context) *Server {
	return &Server{
		gpt: gpt,
		ctx: ctx,
	}
}

func (s *Server) Run() {
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Websocket Connected!")
		for {
			messageType, messageContent, err := conn.ReadMessage()
			if err != nil {
				log.Println(err)
				return
			}

			fmt.Println(string(messageContent))
			// timeReceive := time.Now()
			messageResponse := s.gpt.CreateChatCompletion(s.ctx, string(messageContent))
			if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
				log.Println(err)
				return
			}
		}
	})

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		log.Fatal(err)
	}
}
