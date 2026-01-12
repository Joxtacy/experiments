#!/usr/bin/perl
use strict;
use warnings;

# Prompt the user
print "Enter your name: ";
my $name = <STDIN>;
chomp($name);

# Print a greeting
print "Hello, $name! Welcome to Perl scripting.\n";

if (index($name, "IPAAS_CALLBACK_URL") != -1) {
	print "found\n";
} else {
	print "not found\n";
}

my $ipaas_callback_url = "http://localhost:8080";
$name =~ s/IPAAS_CALLBACK_URL/$ipaas_callback_url/;

print "$name\n";
