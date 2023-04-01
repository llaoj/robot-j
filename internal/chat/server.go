package chat

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/llaoj/robot-j/internal/GPT"
	"github.com/llaoj/robot-j/internal/config"
)

type Server struct {
	gpt    *GPT.GPT
	ctx    context.Context
	config *config.ChatServer
}

func NewServer(gpt *GPT.GPT, ctx context.Context, config *config.ChatServer) *Server {
	return &Server{
		gpt:    gpt,
		ctx:    ctx,
		config: config,
	}
}

func (s *Server) Run() {
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
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
			messageResponse := s.gpt.CreateChatCompletion(s.ctx, string(messageContent))
			fmt.Println(messageResponse)
			if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
				log.Println(err)
				return
			}
		}
	})

	// err := http.ListenAndServe(s.config.Addr, nil)
	err := http.ListenAndServeTLS(s.config.Addr, s.config.CertFile, s.config.KeyFile, nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Chat server is running at", s.config.Addr)
}
