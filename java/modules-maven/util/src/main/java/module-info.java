module com.example.util {
    exports com.example.util;
    provides com.example.util.GreeterService with com.example.util.DefaultGreeter;
}
