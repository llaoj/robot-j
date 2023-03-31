FROM golang

WORKDIR /app

COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

CMD ["robot-j", "--config=/etc/robot-j/config.yaml"]