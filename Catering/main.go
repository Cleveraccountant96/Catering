package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type Item struct {
	Name  string
	Price float64
}

type CartResponse struct {
	Items    []Item
	Subtotal float64
	VAT      float64
	Total    float64
	Paid     bool
}

var cart []Item

func main() {
	r := mux.NewRouter()

	// Cart routes
	r.HandleFunc("/cart/add", addToCart).Methods("POST")
	r.HandleFunc("/cart/remove/{index}", removeFromCart).Methods("POST")
	r.HandleFunc("/cart/pay", payCart).Methods("POST")

	// Checkout page (server-rendered)
	r.HandleFunc("/checkout", checkoutPage).Methods("GET")

	// Serve static files (menus.html, home.html, CSS, etc.)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./templates/")))

	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

// ===== Handlers =====

// Checkout page
func checkoutPage(w http.ResponseWriter, r *http.Request) {
	response := buildCartResponse()
	tmpl := template.Must(template.ParseFiles("templates/checkout.html"))
	tmpl.Execute(w, response)
}

// Add item
func addToCart(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("name")
	priceStr := r.FormValue("price")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil || name == "" {
		http.Error(w, "Invalid item", http.StatusBadRequest)
		return
	}

	cart = append(cart, Item{Name: name, Price: price})
	http.Redirect(w, r, "/checkout", http.StatusSeeOther)
}

// Remove item
func removeFromCart(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	index, err := strconv.Atoi(params["index"])
	if err != nil || index < 0 || index >= len(cart) {
		http.Error(w, "Invalid index", http.StatusBadRequest)
		return
	}

	cart = append(cart[:index], cart[index+1:]...)
	http.Redirect(w, r, "/checkout", http.StatusSeeOther)
}

// Pay
func payCart(w http.ResponseWriter, r *http.Request) {
	response := buildCartResponse()
	response.Paid = true
	cart = []Item{} // clear cart

	tmpl := template.Must(template.ParseFiles("templates/checkout.html"))
	tmpl.Execute(w, response)
}

// Cart calculation
func buildCartResponse() CartResponse {
	total := 0.0
	for _, item := range cart {
		total += item.Price
	}

	return CartResponse{
		Items:    cart,
		Total:    total,
	}
}
